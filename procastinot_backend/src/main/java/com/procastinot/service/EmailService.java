package com.procastinot.service;

public interface EmailService {
    void sendTemporaryPassword(String toEmail, String tempPassword);
}