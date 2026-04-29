import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Row from './Row';
import SortOrderSelect from './SortOrderSelect';
import { useGetOpeningHoursQuery } from '../../../store/api';

const Section = styled.section`
  margin-bottom: 2rem;
`;

const ControlsGroup = styled.div`
  margin-bottom: 1.65rem;
`;

const AreaTitle = styled.h2`
  font-family: ${props => props.theme.typography.fonts.display};
  color: #6C4839;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  &::first-letter {
    color: #A12020;
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1.25rem 0.5rem 1.25rem;
`;

const SingleRiderLabel = styled.div`
  color: #6C4839;
  font-size: 10px;
  font-weight: 700;
  text-align: right;
  line-height: 1;
`;

const SecondColumnSingleRiderLabel = styled(SingleRiderLabel)`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

const GridLayout = styled.div`
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 2rem;
  }
`;

const Column = styled.div`
  position: relative;

  ${TableHeader} {
    position: absolute;
    top: -2rem;
    right: 0;
    width: 100%;
  }
`;

const NearbyNotice = styled.p`
  margin: 0.85rem 0 0.15rem;
  color: #A12020;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  width: 100%;
`;

const SORT_OPTIONS = [
  { value: 'name', label: 'Naam' },
  { value: 'queue-time', label: 'Wachttijd' },
  { value: 'nearby', label: 'Afstand' }
];

const PARK_CENTER = {
  lat: 51.650489027622044,
  lng: 5.051364994661061
};

const MAX_PARK_DISTANCE_METERS = 1500;

const compareByName = (a, b) =>
  a.name.localeCompare(b.name, 'nl', {
    sensitivity: 'base',
    ignorePunctuation: true
  });

const getDistanceInMeters = (origin, destination) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const earthRadius = 6371000;
  const deltaLat = toRadians(destination.lat - origin.lat);
  const deltaLng = toRadians(destination.lng - origin.lng);

  const haversineComponent =
    (Math.sin(deltaLat / 2) ** 2) +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(destination.lat)) *
      (Math.sin(deltaLng / 2) ** 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversineComponent), Math.sqrt(1 - haversineComponent));
};

const Table = ({ area, entities }) => {
  const { data: openingHours } = useGetOpeningHoursQuery();
  const [sortOrder, setSortOrder] = useState('name');
  const [userLocation, setUserLocation] = useState(null);
  const [locationAttempted, setLocationAttempted] = useState(false);

  useEffect(() => {
    if (sortOrder !== 'nearby' || userLocation || locationAttempted) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationAttempted(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationAttempted(true);
      },
      () => {
        setLocationAttempted(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  }, [sortOrder, userLocation, locationAttempted]);

  const isOutsidePark = useMemo(() => {
    if (!userLocation) {
      return false;
    }

    return getDistanceInMeters(userLocation, PARK_CENTER) > MAX_PARK_DISTANCE_METERS;
  }, [userLocation]);

  // Determine if park is closed based on opening hours
  const isParkClosed = !openingHours?.today || new Date() < new Date(openingHours.today.openingTime) || new Date() > new Date(openingHours.today.closingTime);

  const sortedEntities = useMemo(() => {
    const list = [...entities];

    if (sortOrder === 'queue-time') {
      return list.sort((a, b) => {
        const aHasQueueTime = typeof a.waitTime === 'number';
        const bHasQueueTime = typeof b.waitTime === 'number';

        if (aHasQueueTime && bHasQueueTime) {
          if (b.waitTime !== a.waitTime) {
            return b.waitTime - a.waitTime;
          }
          return compareByName(a, b);
        }

        if (aHasQueueTime) return -1;
        if (bHasQueueTime) return 1;

        return compareByName(a, b);
      });
    }

    if (sortOrder === 'nearby' && userLocation && !isOutsidePark) {
      return list.sort((a, b) => {
        const aCoords = a.coordinates;
        const bCoords = b.coordinates;
        const aHasCoords = Boolean(aCoords);
        const bHasCoords = Boolean(bCoords);

        if (aHasCoords && bHasCoords) {
          const aDistance = getDistanceInMeters(userLocation, aCoords);
          const bDistance = getDistanceInMeters(userLocation, bCoords);
          if (aDistance !== bDistance) {
            return aDistance - bDistance;
          }
          return compareByName(a, b);
        }

        if (aHasCoords) return -1;
        if (bHasCoords) return 1;

        return compareByName(a, b);
      });
    }

    return list.sort(compareByName);
  }, [entities, sortOrder, userLocation, isOutsidePark]);

  // Calculate the midpoint to split the list evenly
  const midPoint = Math.ceil(sortedEntities.length / 2);
  const firstColumn = sortedEntities.slice(0, midPoint);
  const secondColumn = sortedEntities.slice(midPoint);

  return (
    <Section>
      {area && <AreaTitle>{area}</AreaTitle>}
      <ControlsGroup>
        <SortOrderSelect
          value={sortOrder}
          onChange={setSortOrder}
          options={SORT_OPTIONS}
        />
        {sortOrder === 'nearby' && userLocation && isOutsidePark && (
          <NearbyNotice>
           Het lijkt erop dat je niet in de Efteling bent. Probeer het opnieuw wanneer je binnen de Efteling bent.
          </NearbyNotice>
        )}
      </ControlsGroup>
      <GridLayout>
        <Column>
          {!isParkClosed && (
            <TableHeader>
              <SingleRiderLabel>
                SINGLE<br />
                RIDER
              </SingleRiderLabel>
            </TableHeader>
          )}
          {firstColumn.map((entity, index) => (
            <Row
              key={entity.name}
              name={entity.name}
              waitTime={entity.waitTime}
              singleRider={entity.singleRider}
              status={entity.status}
              isEvenDesktop={index % 2 === 0}
              isEvenMobile={index % 2 === 0}
              isParkClosed={isParkClosed}
            />
          ))}
        </Column>
        <Column>
          {!isParkClosed && (
            <TableHeader>
              <SecondColumnSingleRiderLabel>
                SINGLE<br />
                RIDER
              </SecondColumnSingleRiderLabel>
            </TableHeader>
          )}
          {secondColumn.map((entity, index) => (
            <Row
              key={entity.name}
              name={entity.name}
              waitTime={entity.waitTime}
              singleRider={entity.singleRider}
              status={entity.status}
              isEvenDesktop={index % 2 === 0}
              isEvenMobile={(midPoint + index) % 2 === 0}
              isParkClosed={isParkClosed}
            />
          ))}
        </Column>
      </GridLayout>
    </Section>
  );
};

export default Table; 