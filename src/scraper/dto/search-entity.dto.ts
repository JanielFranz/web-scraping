import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchEntityDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @Transform(({ value }) => {
        // Convert number to string if it's a number
        if (typeof value === 'number') {
            return value.toString();
        }
        // Convert other types to string
        if (value !== null && value !== undefined) {
            return String(value).trim();
        }
        return value;
    })
    name: string;
}
