package de.vlaorgatu.vlabackend.helperclasses.requestbodytemplates;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a time frame.
 */
@Builder
@AllArgsConstructor
@Getter
@Setter
public class TimeFrame {
    /**
     * Start of the time frame.
     */
    @JsonInclude
    private LocalDateTime commence;

    /**
     * End of the time frame.
     */
    @JsonInclude
    private LocalDateTime terminate;
}
