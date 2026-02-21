/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2026-02-21 11:54:41.

export interface LinusAppointment {
    id: number;
    linusUserId: number;
    orderTime?: Date;
    status: number;
    appointmentTime?: Date;
    comment?: string;
    name?: string;
}

export interface LinusExperiment {
    id: number;
    categoryId: number;
    name: string;
    description?: string;
    comment?: string;
    preparationTime?: number;
    status: string;
    executionTime?: number;
    safetySigns?: string;
    experimentNumber: number;
}

export interface LinusExperimentBooking {
    id: number;
    linusAppointmentId?: number;
    linusExperimentId: number;
    linusUserId: number;
    status: number;
    pinnedOn?: Date;
}

export interface LinusUser {
    id: number;
    name: string;
    roles: string;
    password: string;
    email: string;
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
    bookings: ExperimentBooking[];
}

export interface AppointmentBuilder {
}

export interface AppointmentCategory {
    id: number;
    title: string;
}

export interface AppointmentCategoryBuilder {
}

export interface AppointmentSeries {
    id: number;
    lecture?: Lecture;
    name: string;
    category: AppointmentCategory;
}

export interface AppointmentSeriesBuilder {
}

export interface ExperimentBooking {
    id: number;
    linusExperimentId: number;
    linusExperimentBookingId?: number;
    notes: string;
    status: ExperimentPreparationStatus;
    person?: Person;
}

export interface ExperimentBookingBuilder {
}

export interface GlobalNote {
    id: number;
    color: string;
    title: string;
    content: string;
}

export interface Lecture {
    id: number;
    name: string;
    semester: string;
    color: string;
    persons: Person[];
}

export interface Person {
    id: number;
    name: string;
    email: string;
    notes: string;
    linusUserId?: number;
    lectures: Lecture[];
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export enum ExperimentPreparationStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
}

export enum SseMessageType {
    SSEDEBUG = "SSEDEBUG",
    GLOBALNOTECREATED = "GLOBALNOTECREATED",
    GLOBALNOTEUPDATED = "GLOBALNOTEUPDATED",
    GLOBALNOTEDELETED = "GLOBALNOTEDELETED",
    EXPERIMENTBOOKINGUPDATED = "EXPERIMENTBOOKINGUPDATED",
    APPOINTMENTCREATED = "APPOINTMENTCREATED",
    APPOINTMENTUPDATED = "APPOINTMENTUPDATED",
    APPOINTMENTDELETED = "APPOINTMENTDELETED",
    DEBUG = "DEBUG",
}
