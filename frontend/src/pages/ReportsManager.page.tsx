// Home.page.tsx
import React from 'react';
import { SideMenu } from '@/components/SideMenu/SideMenu';

const ReportsManager: React.FC = () => {
  return (
    <>
      <SideMenu />
      {!selectedLocker ? (
        <Lockers onLockerClick={handleLockerClick} />
      ) : !selectedBox ? (
        <Boxes
          locker={selectedLocker}
          onBoxClick={handleBoxClick}
          onReturn={handleReturnToLockers}
        />
      ) : selectedBox && !createBooking ? (
        <Objects
          box={selectedBox}
          onReturn={handleReturnToBoxes}
          onCreateBooking={handleCreateBookingClick}
        />
      ) : createBooking ? (
        <BookingForm
          box={selectedBox}
          items={selectedItems}
          onReturnToBox={handleReturnToBox}
          onReturn={handleReturnToLockers}
          onBookingCreated={updatePendingBookings}
        />
      ) : null}
    </>
  );
};

export default ReportsManager;
