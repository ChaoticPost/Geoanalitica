from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.db.session import get_db
from app.models.user import User
from app.models.geo import GeoPoint, GeoPolygon
from app.schemas.geo import (
    GeoPoint as GeoPointSchema,
    GeoPointCreate,
    GeoPolygon as GeoPolygonSchema,
    GeoPolygonCreate,
)
from geoalchemy2.shape import from_shape
from shapely.geometry import Point, Polygon

router = APIRouter()


@router.post("/points", response_model=GeoPointSchema)
async def create_point(
    *,
    db: AsyncSession = Depends(get_db),
    point_in: GeoPointCreate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Create new point"""
    point = GeoPoint(
        name=point_in.name,
        description=point_in.description,
        geometry=from_shape(
            Point(point_in.coordinates.longitude, point_in.coordinates.latitude),
            srid=4326,
        ),
        user_id=current_user.id,
    )
    db.add(point)
    await db.commit()
    await db.refresh(point)
    return point


@router.get("/points", response_model=List[GeoPointSchema])
async def read_points(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve points"""
    points = (
        await db.query(GeoPoint)
        .filter(GeoPoint.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return points


@router.post("/polygons", response_model=GeoPolygonSchema)
async def create_polygon(
    *,
    db: AsyncSession = Depends(get_db),
    polygon_in: GeoPolygonCreate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Create new polygon"""
    coordinates = [(p.longitude, p.latitude) for p in polygon_in.coordinates]
    # Close the polygon if it's not closed
    if coordinates[0] != coordinates[-1]:
        coordinates.append(coordinates[0])

    polygon = GeoPolygon(
        name=polygon_in.name,
        description=polygon_in.description,
        geometry=from_shape(Polygon(coordinates), srid=4326),
        user_id=current_user.id,
    )
    db.add(polygon)
    await db.commit()
    await db.refresh(polygon)
    return polygon


@router.get("/polygons", response_model=List[GeoPolygonSchema])
async def read_polygons(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve polygons"""
    polygons = (
        await db.query(GeoPolygon)
        .filter(GeoPolygon.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return polygons
