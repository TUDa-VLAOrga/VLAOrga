package de.vlaorgatu.vlabackend.helperClasses.requestBodyTemplates;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class TimeFrame {
    @JsonInclude
    private LocalDateTime commence;

    @JsonInclude
    private LocalDateTime terminate;
}
