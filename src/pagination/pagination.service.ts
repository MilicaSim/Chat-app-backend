/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { paginate } from 'nestjs-typeorm-paginate';
import { FindConditions, Repository } from 'typeorm';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class PaginationService {

    public async paginate<T, R>(repository: Repository<T>, findConditions: FindConditions<T>, paginationDto: PaginationDto<R>): Promise<PaginationDto<R>> {
        
        const retValue = await paginate(repository, { page: paginationDto.page, limit: paginationDto.pageSize }, findConditions);

        paginationDto.totalPages = retValue.meta.totalPages;
        paginationDto.totalCount = retValue.meta.itemCount;
        paginationDto.data = retValue.items as unknown as R[];

        // retValue.items.forEach(element => {
    
        //     const a = plainToClass(R, element);
        // });
        
        return paginationDto;
    }
}
