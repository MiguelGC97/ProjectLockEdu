import { Box, Center, Checkbox, Divider, Flex, Input, PasswordInput, Stack } from "@mantine/core";
import classes from './SettingsBox.module.css';
import { IconMessageReport, IconNotification, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export function SettingsBox(){
    const [visible, { toggle }] = useDisclosure(false);
    
    return(
        <>
        <Box bg="transparent" h="80vh" bd="1px solid myPurple.1" w="100%"  style={{
            borderRadius: '83px 0 25px 25px'
        }} >
            <Center className={classes.banner}></Center>
            <Divider size="xs" color="myPurple.1" />
                
            <Input variant="unstyled" size="lg" placeholder="Mi perfil" leftSection={<IconUser size={25} color="white"/>} />
            <Divider size="xs" color="myPurple.1" />

            <Input variant="unstyled" size="lg" ml={60} placeholder="Cambiar contraseña" />
            <Divider size="xs" color="myPurple.1" />

            <Stack m={20} mb={50}>
                <PasswordInput
                    w={220}
                    ml={100}
                    label="Contraseña actual"
                    styles={{
                        label: {
                        color: 'white',
                        fontSize: '15px'
                        }
                    }}
                    defaultValue="secret"
                    visible={visible}
                    onVisibilityChange={toggle}
                />
                <PasswordInput
                    w={220}
                    ml={100}
                    styles={{
                        label: {
                        color: 'white',
                        fontSize: '15px'
                        }
                    }}
                    label="Nueva contraseña"
                    defaultValue="secret"
                    visible={visible}
                    onVisibilityChange={toggle}
                />
            </Stack>
            <Divider size="xs" color="myPurple.1" />

            <Input variant="unstyled" size="lg" placeholder="Configuracion" leftSection={<IconMessageReport size={25} color="white"/>} />
            <Divider size="xs" color="myPurple.1" />

            <Checkbox
                defaultChecked
                label="I agree to sell my privacy"
            />
            
        </Box>
      
        </>
    )
}