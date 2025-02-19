import React, { useCallback, useState } from 'react';
import { IconMessageReport, IconUser } from '@tabler/icons-react';
import bcrypt from 'bcryptjs';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Input,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import { updatePassword } from '@/services/fetch';
import classes from './SettingsBox.module.css';

export function SettingsBox() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [visible, { toggle }] = useDisclosure(false);
  const [showNotification, setShowNotification] = useState(false);

  const { user, notification, updateNotification } = useAuth();

  const checkPassword = useCallback(
    async (password: string) => {
      if (!user?.password) return false;
      return await bcrypt.compare(password, user.password);
    },
    [user]
  );

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1500);
  };

  const handleChangePassword = useCallback(async () => {
    try {
      if (!user) {
        console.error('No user is logged in.');
        return;
      }

      const isCurrentPasswordValid = await checkPassword(currentPassword);
      if (!isCurrentPasswordValid) {
        console.error('Current password is incorrect');
        return;
      }

      await updatePassword(user, newPassword);
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  }, [currentPassword, newPassword, checkPassword, user]);

  return (
    <Box
      bg="transparent"
      h="80vh"
      style={{
        border: '1px solid var(--mantine-color-myPurple-1)',
        borderRadius: '83px 0 25px 25px',
        width: '100%',
      }}
    >
      <Center className={classes.banner} />
      <Divider size="xs" color="myPurple.1" />

      <Input
        readOnly
        variant="unstyled"
        size="lg"
        placeholder="Mi perfil"
        aria-label="Mi perfil"
        leftSection={<IconUser size={25} color="white" />}
      />
      <Divider size="xs" color="myPurple.1" />

      <Input
        readOnly
        variant="unstyled"
        size="lg"
        ml={60}
        placeholder="Cambiar contraseña"
        aria-label="Cambiar contraseña"
      />
      <Divider size="xs" color="myPurple.1" />

      <Stack m={20} mb={50}>
        <PasswordInput
          w={220}
          ml={100}
          label="Contraseña actual"
          styles={{
            label: {
              color: 'white',
              fontSize: '15px',
            },
          }}
          visible={visible}
          onVisibilityChange={toggle}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Flex justify="space-between" align="flex-end">
          <PasswordInput
            w={220}
            ml={100}
            styles={{
              label: {
                color: 'white',
                fontSize: '15px',
              },
            }}
            label="Nueva contraseña"
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            onClick={handleChangePassword}
            variant="filled"
            size="md"
            px="50"
            mr="50"
            radius="xl"
            color="#4F51B3"
          >
            Guardar
          </Button>
        </Flex>
      </Stack>

      <Divider size="xs" color="myPurple.1" mt={30} />

      <Input
        readOnly
        variant="unstyled"
        size="lg"
        placeholder="Configuración"
        aria-label="Configuración"
        leftSection={<IconMessageReport size={25} color="white" />}
      />
      <Divider size="xs" color="myPurple.1" />

      <Flex h="200px" w="100%" justify="space-between" align="center">
        <Flex px="20px" mr="50" h="100%" w="100%" justify="space-between" align="center">
          <Checkbox
            checked={notification}
            ml={50}
            mt={10}
            size="md"
            styles={{
              label: {
                color: 'white',
              },
            }}
            label="Recibir notificaciones de mis recordatorios"
            color="white"
            iconColor="#191970"
            onChange={(e) => {
              updateNotification(e.currentTarget.checked);
              handleSave();
            }}
          />
          {/* <Button
            variant="filled"
            size="md"
            px="50"
            radius="xl"
            color="#4F51B3"
            onClick={() => {
              updateNotification(notification);
              console.log('Preferencia es:', notification);
              setNotificationStatus(true);
            }}
          >
            Guardar
          </Button> */}
        </Flex>
      </Flex>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} // Smooth fade out
          transition={{ duration: 0.5 }}
        >
          <Text ml="50px" c="#b2e8a0">
            ✔ ¡Tus preferencias de notificaciones se han guardado!
          </Text>
        </motion.div>
      )}
    </Box>
  );
}
