import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {}
    transform(value: string, type) {
        if (type == 'PHOTO'){
            return this.sanitized.bypassSecurityTrustUrl(value);
        }
        return value;
    }
}