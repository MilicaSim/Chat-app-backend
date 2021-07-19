import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DefaultPageSizePipe implements PipeTransform {

    constructor(private pageSize: number){}

    transform(value: any, metadata: ArgumentMetadata) {
        if(!value)
            return this.pageSize;
        return value;  
  }
} 