import { NestFactory } from '@nestjs/core';
import { useContainer } from 'typeorm';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3002);
  useContainer(app.select(UserModule), { fallbackOnErrors: true });
  //app.useGlobalGuards(new JwtAuthGuard())
}
bootstrap();

