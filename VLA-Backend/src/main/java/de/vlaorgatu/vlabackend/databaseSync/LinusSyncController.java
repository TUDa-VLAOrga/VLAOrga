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

    // TODO: Change this date and make dynamic
    @GetMapping
    public ResponseEntity<String> syncLinusAppointments() {
        return ResponseEntity.internalServerError().build();
    }
}
