import { Card, Overlay } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAuthStore } from '../store/store';
import classes from './Banner.module.css';

export function Banner() {
  const { user } = useAuthStore();
  const isLaptop = useMediaQuery('(min-width: 1024px) and (max-width: 1280px)');

  return (
    <Card
      aria-label="banner del perfil del usuario"
      radius="none"
      className={classes.card}
      style={{ height: isLaptop ? '100px' : '220px' }}
    >
      <Overlay
        gradient="linear-gradient(90deg, var(--mantine-color-myPurple-7) 10%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 64%, rgba(231,175,46,1) 100%)"
        opacity={0.65}
        zIndex={0}
      />

      <div className={classes.content}>
        <h1 aria-label="texto del banner saludando usuario" className={classes.title}>
          ¡Hola {user?.name}!
        </h1>
      </div>
    </Card>
  );
}
