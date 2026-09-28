package com.retrace.retrace_backend.repository;

import com.retrace.retrace_backend.entity.Item;
import com.retrace.retrace_backend.entity.ItemStatus;
import com.retrace.retrace_backend.entity.ReportType;
import com.retrace.retrace_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ItemRepository
        extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {

    List<Item> findByReportType(ReportType reportType);

    List<Item> findByReportTypeAndStatus(
            ReportType reportType,
            ItemStatus status
    );

    List<Item> findByOwnerAndReportType(
            User owner,
            ReportType reportType
    );

    List<Item> findByOwnerAndReportTypeAndStatus(
            User owner,
            ReportType reportType,
            ItemStatus status
    );

    long countByReportType(ReportType reportType);

    long countByReportTypeAndStatus(
            ReportType reportType,
            ItemStatus status
    );
}