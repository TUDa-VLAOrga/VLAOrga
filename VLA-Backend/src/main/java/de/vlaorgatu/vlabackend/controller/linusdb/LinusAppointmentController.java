package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusAppointment;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusAppointmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/linusAppointments")
public class LinusAppointmentController implements
    defaultGettingForReadonlyReposInterface<LinusAppointment, LinusAppointmentRepository> {

    private LinusAppointmentRepository linusAppointmentRepository;

    @Override
    public LinusAppointmentRepository getRepository() {
        return linusAppointmentRepository;
    }
}
