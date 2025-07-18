import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { AuthGuard } from "@/guards/auth.guard";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { WorkspaceDto } from "@/dtos/workspace.dto";
import ReqCred from "@/decorators/req-cred.decorator";
import ArenaCredential from "@/commons/arena-credential";
import { ApiResult } from "@/dtos/api-result.dto";

@Controller('api/v1/workspaces')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
  ) {}

  @Post('')
  @ApiOkResponseWith(WorkspaceDto)
  @ApiBody({ type: CreateWorkspaceDto })
  async createWorkspace(@Body() dto: CreateWorkspaceDto, @ReqCred() credential: ArenaCredential): Promise<ApiResult<WorkspaceDto>> {
    const workspace = await this.workspacesService.createWorkspace(dto, credential.user);

    return new ApiResult<WorkspaceDto>({ data: WorkspaceDto.fromEntity(workspace) });
  }

  @Get(':workspaceId')
  @ApiOkResponseWith(WorkspaceDto)
  async getWorkspaceByWorkspaceId(@Param('workspaceId') workspaceId: string): Promise<ApiResult<WorkspaceDto>> {
    const workspace = await this.workspacesService.findWorkspaceByWorkspaceId(workspaceId);

    return new ApiResult<WorkspaceDto>({ data: WorkspaceDto.fromEntity(workspace) });
  }
}