import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Get } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('App')
@Controller()
export class AppController {
    @ApiOperation({ summary: 'home', description: 'default response' })
    @Get()
    getHello(): string {
        return 'Hello World';
    }
}