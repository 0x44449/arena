import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { WorkspaceDto } from "@/dto/workspace.dto";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ApiResult } from "@/dto/api-result.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { plainToInstance } from "class-transformer";
import { WorkspaceFeatureDto } from "@/dto/workspace-feature.dto";
import { CreateWorkspaceFeatureDto } from "./dto/create-workspace-feature.dto";
import { AuthGuard } from "@/auth/auth.guard";

@Controller('api/v1/workspaces')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService
  ) {}

  @Put(':workspaceId')
  @ApiOkResponseWithResult(WorkspaceDto)
  @ApiBody({ type: UpdateWorkspaceDto })
  async updateWorkspace(@Param('workspaceId') workspaceId: string, @Body() param: UpdateWorkspaceDto): Promise<ApiResult<WorkspaceDto | null>> {
    const workspace = await this.workspaceService.updateWorkspace(param, workspaceId, 'admin');

    const result = new ApiResult<WorkspaceDto | null>({ data: workspace ? workspace : null });
    return plainToInstance(ApiResult<WorkspaceDto | null>, result);
  }

  @Delete(':workspaceId')
  @ApiOkResponseWithResult()
  async deleteWorkspace(@Param('workspaceId') workspaceId: string): Promise<ApiResult<null>> {
    await this.workspaceService.deleteWorkspace(workspaceId, 'admin');

    const result = new ApiResult<null>({ data: null });
    return plainToInstance(ApiResult<null>, result);
  }

  @Get(':workspaceId')
  @ApiOkResponseWithResult(WorkspaceDto)
  async getWorkspace(@Param('workspaceId') workspaceId: string): Promise<ApiResult<WorkspaceDto | null>> {
    const workspace = await this.workspaceService.getWorkspaceByWorkspaceId(workspaceId);

    const result = new ApiResult<WorkspaceDto | null>({ data: workspace ? workspace : null });
    return plainToInstance(ApiResult<WorkspaceDto | null>, result);
  }

  @Post(':workspaceId/features')
  @ApiOkResponseWithResult(WorkspaceFeatureDto)
  @ApiBody({ type: CreateWorkspaceFeatureDto })
  async createWorkspaceFeature(
    @Param('workspaceId') workspaceId: string,
    @Body() param: CreateWorkspaceFeatureDto
  ): Promise<ApiResult<WorkspaceFeatureDto | null>> {
    const feature = await this.workspaceService.createWorkspaceFeature(param, workspaceId);

    const result = new ApiResult<WorkspaceFeatureDto | null>({ data: feature ? feature : null });
    return plainToInstance(ApiResult<WorkspaceFeatureDto | null>, result);
  }
}