import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Get } from "@nestjs/common/decorators/http/request-mapping.decorator";

@Controller()
export class AppController {
    @Get()
    getHello(): string {
        return 'Hello World';
    }
}