import { useEffect, useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.aside`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1200;
  background: rgba(20, 20, 20, 0.92);
  color: #f7f7f7;
  border-radius: 10px;
  padding: 0.65rem 0.8rem;
  min-width: 220px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.8rem;
  line-height: 1.4;
`;

const DebugTitle = styled.div`
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const CoordinateValue = styled.div`
  word-break: break-word;
`;

const isTypingTarget = (target) => {
  if (!target) return false;
  const tagName = target.tagName?.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
};

const DebugPanel = ({ location, sortOrder, isOutsidePark, locationAttempted }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'd') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <PanelContainer>
      <DebugTitle>Debug panel (D toggle)</DebugTitle>
      <CoordinateValue>sort: {sortOrder}</CoordinateValue>
      <CoordinateValue>outside park: {isOutsidePark ? 'yes' : 'no'}</CoordinateValue>
      {!locationAttempted && <CoordinateValue>location: not requested yet</CoordinateValue>}
      {locationAttempted && !location && <CoordinateValue>location: unavailable</CoordinateValue>}
      {location && (
        <>
          <CoordinateValue>lat: {location.lat}</CoordinateValue>
          <CoordinateValue>lng: {location.lng}</CoordinateValue>
        </>
      )}
    </PanelContainer>
  );
};

export default DebugPanel;
