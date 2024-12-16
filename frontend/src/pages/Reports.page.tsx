import React, { useState } from 'react';
import { Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ReportForm } from '@/components/ReportForm/ReportForm';
import { ReportsBox } from '@/components/ReportsBox/ReportsBox';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBarReport from '@/components/UserBarReport/UserBarReport';


const Reports: React.FC = () => {
 
  const isMobile = useMediaQuery('(max-width: 768px)');


  const [isReportFormVisible, setIsReportFormVisible] = useState(true);

  const toggleReportFormVisibility = () => {
    setIsReportFormVisible((prevState) => !prevState);
  };

  return (
    <>
      {!isMobile && (
        <Flex w="100%">
          <SideMenu />
          <Flex p="xl" direction="column" w="100%">
            <UserBarReport onToggleVisibility={toggleReportFormVisibility} />
            <Flex direction="row" w="100%" gap="md">
              <ReportsBox />
              {isReportFormVisible && <ReportForm />}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Reports;
