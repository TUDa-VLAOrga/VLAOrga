package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for retrieving {@link LinusAppointment}s.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/linusAppointments")
public class LinusAppointmentController implements
    DefaultGettingForReadonlyReposInterface<LinusAppointment, LinusAppointmentRepository> {

    /**
     * Repository containing all {@link LinusAppointment}s.
     */
    private LinusAppointmentRepository linusAppointmentRepository;

    /**
     * Retrieves the repository from the controller instance.
     *
     * @return The read-only repository used by the controller
     */
    @Override
    public LinusAppointmentRepository getRepository() {
        return linusAppointmentRepository;
    }
}
