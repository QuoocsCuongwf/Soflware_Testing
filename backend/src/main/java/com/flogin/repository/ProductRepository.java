package com.flogin.repository;

import com.flogin.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Product Repository - Repository cho Product entity
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategory(String category);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByIsAvailable(Boolean isAvailable);
    
    List<Product> findByCreatedBy(Long userId);
}
