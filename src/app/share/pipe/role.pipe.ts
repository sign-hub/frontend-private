import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {
    transform(value: string): string {
        let role: string;
        if (value === 'ADMIN') {
            role = 'Platform Adminstrator';
        } else if (value === 'CON_PRO') {
            role = 'Platform content provider';
        } else if (value === 'AT_CON_PRO') {
            role = 'Atlas tool content provider';
        } else if (value === 'TT_EDITOR') {
            role = 'Testing tool editor';
        } else if (value === 'TT_USER') {
            role = 'Testing tool user';
        } else if (value === 'GRAMMAR_ADMIN') {
            role = 'Grammar tool administrator';
        } else if (value === 'GR_CON_PRO') {
            role = 'Grammar tool content provider';
        } else if (value === 'AT_ADMIN') {
            role = 'Atlas tool administrator';
        } else if (value === 'TT_ADMIN') {
            role = 'Testing tool administrator';
        } else if (value === 'ST_ADMIN') {
            role = 'Streaming tool administrator';
        } else {
            role = 'Simple user';
        }
        console.log(role);
        return role;
    }
}