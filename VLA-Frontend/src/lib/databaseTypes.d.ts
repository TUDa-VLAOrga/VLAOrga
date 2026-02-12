/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2026-02-12 07:44:58.

export interface Acceptance {
    id: number;
    appointment: Appointment;
    start: Date;
    end: Date;
}

export interface AcceptanceController {
}

export interface AcceptanceRepository extends JpaRepository<Acceptance, number> {
}

export interface Appointment {
    id: number;
    series: AppointmentSeries;
    start: Date;
    end: Date;
    notes: string;
}

export interface AppointmentController {
}

export interface AppointmentRepository extends JpaRepository<Appointment, number> {
}

export interface AppointmentCategory {
    id: number;
    title: string;
}

export interface AppointmentCategoryController {
}

export interface AppointmentCategoryRepository extends JpaRepository<AppointmentCategory, number> {
}

export interface AppointmentSeries {
    id: number;
    lecture: Lecture;
    category: AppointmentCategory;
}

export interface AppointmentSeriesController {
}

export interface AppointmentSeriesRepository extends JpaRepository<AppointmentSeries, number> {
}

export interface ExperimentBooking {
    id: number;
    linusExperimentId: number;
    linusExperimentBookingId: number;
    person: Person;
    appointment: Appointment;
}

export interface ExperimentBookingController {
}

export interface ExperimentBookingRepository extends JpaRepository<ExperimentBooking, number> {
}

export interface Lecture {
    id: number;
    name: string;
    semester: string;
    color: string;
}

export interface LectureController {
}

export interface LectureRepository extends JpaRepository<Lecture, number> {
}

export interface Person {
    id: number;
    name: string;
    notes: string;
    linusUserId: number;
}

export interface PersonController {
}

export interface PersonRepository extends JpaRepository<Person, number> {
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface UserController {
    allUsers: User[];
}

export interface UserRepository extends JpaRepository<User, number> {
}

export interface JpaRepository<T, ID> extends ListCrudRepository<T, ID>, ListPagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {
}

export interface ListCrudRepository<T, ID> extends CrudRepository<T, ID> {
}

export interface ListPagingAndSortingRepository<T, ID> extends PagingAndSortingRepository<T, ID> {
}

export interface QueryByExampleExecutor<T> {
}

export interface CrudRepository<T, ID> extends Repository<T, ID> {
}

export interface PagingAndSortingRepository<T, ID> extends CrudRepository<T, ID> {
}

export interface Repository<T, ID> {
}
