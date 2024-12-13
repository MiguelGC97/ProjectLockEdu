import React, { useState } from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ReportForm } from '@/components/ReportForm/ReportForm';
import { ReportsBox } from '@/components/ReportsBox/ReportsBox';
import UserBarReport from '@/components/UserBarReport/UserBarReport';

const Reports: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isReportFormVisible, setIsReportFormVisible] = useState(true);

  const toggleReportFormVisibility = () => {
    setIsReportFormVisible((prevState) => !prevState);
  };

  return (
    <>
      {!isMobile && (
        <Flex p="xl" direction="column" w="100%">
          <UserBarReport onToggleVisibility={toggleReportFormVisibility} />
          <Flex  direction="row" w="100%" gap="md" >
            <ReportsBox />
            {isReportFormVisible && <ReportForm />}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Reports;
