import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { Response } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ResponseConfigInterceptor } from 'src/common/interceptor/tranform.interceptor';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Roles(['admin'])
  @UseInterceptors(ResponseConfigInterceptor)
  async create(@Body() createCatDto: CreateCatDto, @Res() res: Response) {
    this.catsService.create(createCatDto);
    res.status(HttpStatus.CREATED).json('hehe');
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
