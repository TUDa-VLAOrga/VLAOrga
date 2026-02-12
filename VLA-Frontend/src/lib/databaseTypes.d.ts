/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2026-02-12 19:33:03.

export interface LinusAppointment {
    id: number;
    linusUserId: number;
    orderTime: Date;
    status: number;
    appointmentTime: Date;
    comment: string;
    name: string;
}

export interface LinusExperimentBooking {
    id: number;
    linusAppointmentId: number;
    linusExperimentId: number;
    linusUserId: number;
    status: number;
    pinnedOn: Date;
}

export interface Acceptance {
    id: number;
    appointment: Appointment;
    start: Date;
    end: Date;
}

export interface Appointment {
    id: number;
    series: AppointmentSeries;
    start: Date;
    end: Date;
    notes: string;
}

export interface AppointmentCategory {
    id: number;
    title: string;
}

export interface AppointmentSeries {
    id: number;
    lecture: Lecture;
    category: AppointmentCategory;
}

export interface ExperimentBooking {
    id: number;
    linusExperimentId: number;
    linusExperimentBookingId: number;
    person: Person;
    appointment: Appointment;
    notes: string;
    status: ExperimentPreparationStatus;
}

export interface Lecture {
    id: number;
    name: string;
    semester: string;
    color: string;
}

export interface Person {
    id: number;
    name: string;
    notes: string;
    linusUserId: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export const enum ExperimentPreparationStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
}

export const enum SseMessageType {
    DEBUG = "DEBUG",
    EXPERIMENT = "EXPERIMENT",
    CALENDAR = "CALENDAR",
    APPROVEDELETION = "APPROVEDELETION",
}
