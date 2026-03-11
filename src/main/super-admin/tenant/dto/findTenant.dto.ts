import { BaseFilter } from "@/lib/filter/baseFilter";
import { PickType } from "@nestjs/swagger";

export class TenantFilterDto extends PickType(BaseFilter,[
    'search',
    'page',
    'limit'
]) {

}