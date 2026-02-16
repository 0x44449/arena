package com.arena.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ArenaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArenaBackendApplication.class, args);
	}

}
