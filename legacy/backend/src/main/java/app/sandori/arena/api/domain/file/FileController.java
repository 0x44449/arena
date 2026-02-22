package app.sandori.arena.api.domain.file;

import app.sandori.arena.api.domain.file.dtos.FileResponse;
import app.sandori.arena.api.domain.file.dtos.GetPresignedUrlRequest;
import app.sandori.arena.api.domain.file.dtos.PresignedUrlResponse;
import app.sandori.arena.api.domain.file.dtos.RegisterFileRequest;
import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.RequireSession;
import app.sandori.arena.api.global.dto.ApiResult;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "files")
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("presigned-url")
    @RequireSession
    @Operation(summary = "파일 업로드 URL 발급", operationId = "getPresignedUrl")
    public SingleApiResult<PresignedUrlResponse> getPresignedUrl(
            @CurrentUser CachedUser user,
            @RequestBody GetPresignedUrlRequest request) {
        PresignedUrlResponse result = fileService.generatePresignedUrl(
                user.userId(), "public", request.getDirectory(), request.getMimeType());
        return SingleApiResult.of(result);
    }

    @PostMapping("register")
    @RequireSession
    @Operation(summary = "파일 등록", operationId = "registerFile")
    public SingleApiResult<FileResponse> registerFile(
            @CurrentUser CachedUser user,
            @RequestBody RegisterFileRequest request) {
        FileEntity file = fileService.registerFile(user.userId(), "public", request);
        return SingleApiResult.of(FileResponse.from(file));
    }

    @PostMapping("private/presigned-url")
    @RequireSession
    @Operation(summary = "Private 파일 업로드 URL 발급", operationId = "getPrivatePresignedUrl")
    public SingleApiResult<PresignedUrlResponse> getPrivatePresignedUrl(
            @CurrentUser CachedUser user,
            @RequestBody GetPresignedUrlRequest request) {
        PresignedUrlResponse result = fileService.generatePresignedUrl(
                user.userId(), "private", request.getDirectory(), request.getMimeType());
        return SingleApiResult.of(result);
    }

    @PostMapping("private/register")
    @RequireSession
    @Operation(summary = "Private 파일 등록", operationId = "registerPrivateFile")
    public SingleApiResult<FileResponse> registerPrivateFile(
            @CurrentUser CachedUser user,
            @RequestBody RegisterFileRequest request) {
        FileEntity file = fileService.registerFile(user.userId(), "private", request);
        return SingleApiResult.of(FileResponse.from(file));
    }

    @GetMapping("{fileId}")
    @RequireSession
    @Operation(summary = "파일 조회", operationId = "getFile")
    public SingleApiResult<FileResponse> getFile(@PathVariable String fileId) {
        FileEntity file = fileService.getFileById(fileId);
        return SingleApiResult.of(FileResponse.from(file));
    }

    @DeleteMapping("{fileId}")
    @RequireSession
    @Operation(summary = "파일 삭제", operationId = "deleteFile")
    public ApiResult deleteFile(
            @CurrentUser CachedUser user,
            @PathVariable String fileId) {
        fileService.deleteFile(fileId, user.userId());
        return ApiResult.success();
    }
}
