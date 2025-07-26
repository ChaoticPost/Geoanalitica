from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from api.deps import get_current_active_user
from db.session import get_db
from models.user import User
from models.geo import GeoPoint, GeoPolygon
from geoalchemy2.functions import ST_Distance, ST_Contains, ST_Area

router = APIRouter()


@router.get("/points-in-polygon/{polygon_id}")
async def get_points_in_polygon(
    polygon_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get all points within a specific polygon"""
    polygon = (
        await db.query(GeoPolygon)
        .filter(GeoPolygon.id == polygon_id, GeoPolygon.user_id == current_user.id)
        .first()
    )

    if not polygon:
        raise HTTPException(status_code=404, detail="Polygon not found")

    points = (
        await db.query(GeoPoint)
        .filter(
            GeoPoint.user_id == current_user.id,
            func.ST_Contains(polygon.geometry, GeoPoint.geometry),
        )
        .all()
    )

    return points


@router.get("/nearest-points/{point_id}")
async def get_nearest_points(
    point_id: int,
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get nearest points to a specific point"""
    reference_point = (
        await db.query(GeoPoint)
        .filter(GeoPoint.id == point_id, GeoPoint.user_id == current_user.id)
        .first()
    )

    if not reference_point:
        raise HTTPException(status_code=404, detail="Point not found")

    nearest_points = (
        await db.query(
            GeoPoint,
            func.ST_Distance(GeoPoint.geometry, reference_point.geometry).label(
                "distance"
            ),
        )
        .filter(GeoPoint.id != point_id, GeoPoint.user_id == current_user.id)
        .order_by("distance")
        .limit(limit)
        .all()
    )

    return nearest_points


@router.get("/polygon-area/{polygon_id}")
async def get_polygon_area(
    polygon_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Calculate area of a polygon in square meters"""
    polygon = (
        await db.query(GeoPolygon)
        .filter(GeoPolygon.id == polygon_id, GeoPolygon.user_id == current_user.id)
        .first()
    )

    if not polygon:
        raise HTTPException(status_code=404, detail="Polygon not found")

    area = await db.query(
        func.ST_Area(func.ST_Transform(polygon.geometry, 3857))
    ).scalar()

    return {"area_m2": area}
