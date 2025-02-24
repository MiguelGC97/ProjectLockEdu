import React, { useState } from 'react';
import { Flex, FocusTrap, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ReportForm } from '@/components/ReportForm/ReportForm';
import { ReportsBox } from '@/components/ReportsBox/ReportsBox';
import { SideMenu } from '@/components/SideMenu/SideMenu';
import UserBarReport from '@/components/UserBarReport/UserBarReport';
import { useTheme } from '@/hooks/ThemeProvider';

const Reports: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isReportFormVisible, setIsReportFormVisible] = useState(false);

  const toggleReportFormVisibility = () => {
    setIsReportFormVisible((prevState) => !prevState);
  };

  return (
    <>
      {!isMobile && (
        <Flex w="100%">
          <SideMenu />
          <Flex p="xl" direction="column" w="100%">
            <UserBarReport
              onToggleVisibility={toggleReportFormVisibility}
              aria-label="Alternar visibilidad del formulario de reporte"
            />
            <Flex direction="row" w="100%" gap="md">
              <ReportsBox />
              {isReportFormVisible && (
                <FocusTrap active>
                  <ReportForm aria-label="Formulario para reportar una incidencia" />
                </FocusTrap>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Reports;
