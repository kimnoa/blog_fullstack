package com.timeblock.myblog.service.implement;

import com.timeblock.myblog.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileServiceImplement implements FileService {

    @Value("${file.path:fileUploads}")
    private String filePath;
    @Value("${file.url:http://localhost:4000/file/}")
    private String fileUrl;

    // 애플리케이션 시작 시 파일 디렉토리 생성
    @PostConstruct
    public void init() {
        try {
            // 시스템 변수 MYBLOG를 사용하여 blog_fullstack 디렉토리까지의 경로 가져오기
            String myblogPath = System.getenv("MYBLOG");
            if (myblogPath == null) {
                log.warn("MYBLOG environment variable is not set, using default path");

                // 시스템 변수가 설정되지 않은 경우 기본값 사용
                String userHome = System.getProperty("user.home");
                myblogPath = Paths.get(userHome, "fileUploads").toString();
            }
            
            Path uploadPath = Paths.get(myblogPath, filePath).toAbsolutePath().normalize();
        
            // 디렉토리가 존재하지 않으면 생성
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("File directory created: {}", uploadPath);
            }
            
            // filePath를 절대 경로로 업데이트
            filePath = uploadPath.toString() + File.separator;
            log.info("File upload path: {}", filePath);
            
        } catch (Exception e) {
            log.error("Failed to create file directory: {}", e.getMessage());
        }
    }

    @Override
    public String upload(MultipartFile file) {
        if (file.isEmpty()) return null;

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) return null;
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        String saveFileName = uuid + extension;
        String savePath = filePath + saveFileName;

        try {
            file.transferTo(new File(savePath));
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }

        String url = fileUrl + saveFileName;
        return url;
    }

    @Override
    public Resource getImage(String fileName) {
        Resource resource = null;
        try {
            resource = new UrlResource("file:" + filePath + fileName);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
        return resource;
    }
}
