from pydantic import BaseModel, Field
from typing import Optional, List, Tuple
from datetime import datetime


class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class GeoPointBase(BaseModel):
    name: str
    description: Optional[str] = None
    coordinates: Coordinates


class GeoPointCreate(GeoPointBase):
    pass


class GeoPoint(GeoPointBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GeoPolygonBase(BaseModel):
    name: str
    description: Optional[str] = None
    coordinates: List[Coordinates]  # List of points forming a polygon


class GeoPolygonCreate(GeoPolygonBase):
    pass


class GeoPolygon(GeoPolygonBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
