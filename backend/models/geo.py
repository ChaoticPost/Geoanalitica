from sqlalchemy import Column, String, Integer, ForeignKey
from geoalchemy2 import Geometry
from db.base import TimestampedBase


class GeoPoint(TimestampedBase):
    __tablename__ = "geo_points"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    geometry = Column(Geometry(geometry_type="POINT", srid=4326))
    user_id = Column(Integer, ForeignKey("users.id"))


class GeoPolygon(TimestampedBase):
    __tablename__ = "geo_polygons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    geometry = Column(Geometry(geometry_type="POLYGON", srid=4326))
    user_id = Column(Integer, ForeignKey("users.id"))
