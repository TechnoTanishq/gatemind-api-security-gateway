package com.gatemind.client.dto.request;

import com.gatemind.client.entity.enums.Plan;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Backend base URL is required")
    private String backendBaseUrl;

    @NotNull(message = "Plan is required")
    private Plan plan;
}
