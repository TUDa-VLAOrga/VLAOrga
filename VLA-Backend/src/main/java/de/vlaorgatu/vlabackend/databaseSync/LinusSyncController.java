package de.vlaorgatu.vlabackend.databaseSync;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/sync")
public class LinusSyncController {
    private LinusSyncService syncService;
    
    @GetMapping
    public ResponseEntity<String> syncLinusAppointments() {
        syncService.syncAppointments(
            LocalDateTime.of(2020, 1, 1, 0, 0),
            LocalDateTime.of(2021, 1, 1, 0, 0)
        );
        return ResponseEntity.ok("Updated");
    }
}
