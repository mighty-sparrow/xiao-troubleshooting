import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(size: number, decimals = 2, extension: string = 'MB') {
    return (size / (1024 * 1024)).toFixed(decimals) + extension;
  }
}
