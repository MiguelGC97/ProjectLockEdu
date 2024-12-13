// import './ReportsBox.module.css';

// import { useEffect, useState } from 'react';
// import styled from '@emotion/styled';
// import {
//   Accordion,
//   Avatar,
//   Box,
//   Center,
//   Divider,
//   Flex,
//   ScrollArea,
//   Table,
//   Text,
// } from '@mantine/core';
// import { fetchIncidences } from '@/services/fetch';
// import { Incidence } from '@/types/types';

// export function ReportsBox() {
//   const [incidences, setIncidences] = useState<Incidence[]>();

//   useEffect(() => {
//     const loadIncidences = async () => {
//       const data = await fetchIncidences();
//       setIncidences(data);
//     };

//     loadIncidences();
//   }, []);

//   const StyledAccordion = styled(Accordion)`

//   .mantine-Accordion-control {
//       &:hover {
//         background-color: #4f51b3;
//         color: white;
//       }
//       &.mantine-Accordion-control-active {
//         background-color: #4f51b3};
//         color: white;
//       }
//     }
//   `;
//   const rows = incidences?.map((report) => (
//     <Accordion.Item key={report.id} value={`casilla-${report.boxId}`}>
//       <Accordion.Control>
//         <Flex justify="space-between" align="center">
//           <Box style={{ width: '33.33%', textAlign: 'center', color: 'white' }}>
//             Casilla {report.boxId}
//           </Box>
//           <Box style={{ width: '33.33%', textAlign: 'center', color: 'white' }}>
//             {new Date(report.createdAt).toLocaleDateString()}
//           </Box>
//           <Box style={{ width: '33.33%', textAlign: 'center' }}>
//             <Text color={report.isSolved ? 'green' : 'red'} fw="bold">
//               {report.isSolved ? 'Resuelto' : 'Pendiente'}
//             </Text>
//           </Box>
//         </Flex>
//       </Accordion.Control>
//       <Accordion.Panel
//         style={{
//           backgroundColor: '#3C3D85',
//           padding: '1rem',
//         }}
//       >
//         <Flex align="center" gap="md">
//           <Avatar
//             src={report.user?.avatar}
//             // || 'https://vivolabs.es/wp-content/uploads/2022/03/perfil-mujer-vivo.png'
//             alt={report.user?.name}
//             radius="xl"
//             size="lg"
//           />
//           <Box>
//             <Text color="white">{report.content}</Text>
//           </Box>
//         </Flex>
//       </Accordion.Panel>
//     </Accordion.Item>
//   ));

//   return (
//     <Box bg="transparent" h="60vh" bd="1px solid myPurple.1" style={{ borderRadius: 40 }}>
//       <Center>
//         <h2>Incidencias</h2>
//       </Center>
//       <Divider size="xs" color="myPurple.1" />

//       <ScrollArea p="lg" m="md" h="50vh" scrollbarSize={16}>
//         <Flex direction="column" gap="xl">
//           <Table horizontalSpacing="sm" verticalSpacing="sm">
//             <Table.Thead c="white">
//               <Table.Tr>
//                 <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
//                   <Text c="white" fw={700}>
//                     Casilla
//                   </Text>
//                 </Table.Th>
//                 <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
//                   <Text c="white" fw={700}>
//                     Fecha
//                   </Text>
//                 </Table.Th>
//                 <Table.Th style={{ textAlign: 'center', width: '33.33%' }}>
//                   <Text c="white" fw={700}>
//                     Estado
//                   </Text>
//                 </Table.Th>
//                 <Table.Th> </Table.Th>
//               </Table.Tr>
//             </Table.Thead>
//           </Table>
//           <StyledAccordion>{rows}</StyledAccordion>
//         </Flex>
//       </ScrollArea>
//     </Box>
//   );
// }
