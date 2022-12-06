import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(val:any , length?: any):string {
    return (val.length>length)? val.slice(0, length)+'...':val
  }

}
