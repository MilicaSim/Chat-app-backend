import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DefaultPagePipe implements PipeTransform {

    constructor(private page: number){}

    transform(value: any, metadata: ArgumentMetadata) {
        if(!value)
            return this.page;
        return value;  
  }
} 