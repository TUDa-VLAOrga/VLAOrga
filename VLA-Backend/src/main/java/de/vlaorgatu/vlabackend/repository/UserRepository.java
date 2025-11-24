package de.vlaorgatu.vlabackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import de.vlaorgatu.vlabackend.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}
