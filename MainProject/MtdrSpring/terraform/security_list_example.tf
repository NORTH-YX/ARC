# Example of a more secure security list configuration

resource "oci_core_security_list" "secure_service_list" {
  compartment_id = var.ociCompartmentOcid
  vcn_id         = oci_core_vcn.okevcn.id
  display_name   = "secure-service-list"

  # Egress rules - restrict to specific destinations rather than 0.0.0.0/0
  egress_security_rules {
    # Allow traffic to specific service networks
    destination      = "10.0.0.0/16" # Example: Internal network CIDR
    protocol         = "6" # TCP
    destination_type = "CIDR_BLOCK"
    stateless        = true # Stateless for better security
    
    # Optional: Restrict by port if needed
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Ingress rules - avoid allowing traffic from 0.0.0.0/0 to sensitive ports
  ingress_security_rules {
    # Allow traffic only from specific source
    source           = "10.0.0.0/16" # Example: Internal network CIDR
    protocol         = "6" # TCP
    source_type      = "CIDR_BLOCK"
    stateless        = true # Set to true for better security
    
    # Define specific ports instead of allowing all
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Example: Allow a specific service access while limiting scope
  ingress_security_rules {
    source           = "0.0.0.0/0" # If public access is absolutely necessary
    protocol         = "6" # TCP
    source_type      = "CIDR_BLOCK"
    stateless        = true
    
    # Limit to specific application port, avoid 22 (SSH) and 3389 (RDP)
    tcp_options {
      min = 8080
      max = 8080
    }
    
    # Optional: Apply additional security with ICMP options
    # icmp_options {
    #   type = 3 # Destination Unreachable
    #   code = 4 # Fragmentation Needed
    # }
  }
}

# Example of a secure bucket configuration 
resource "oci_objectstorage_bucket" "secure_bucket" {
  # Required fields
  namespace      = data.oci_objectstorage_namespace.namespace.namespace
  compartment_id = var.ociCompartmentOcid
  name           = "${var.runName}-${var.mtdrKey}-secure"
  
  # Security enhancements
  versioning     = "Enabled"      # Enable versioning for data protection
  
  # Enable object events for monitoring
  object_events_enabled = true
  
  # Enable encryption with customer managed key (if available)
  kms_key_id = var.kms_key_id # Reference to a KMS key you've created
}

# Example of a secure K8s cluster with pod security policy enabled
resource "oci_containerengine_cluster" "secure_cluster_example" {
  # Required fields
  compartment_id     = var.ociCompartmentOcid
  kubernetes_version = "v1.30.1"
  name               = "secure-cluster-${var.mtdrKey}"
  vcn_id             = oci_core_vcn.okevcn.id
  
  # Configure endpoint with security in mind
  endpoint_config {
    is_public_ip_enabled = false # Use private endpoints where possible
    subnet_id = oci_core_subnet.endpoint.id
    
    # Define network security groups
    nsg_ids = [
      oci_core_network_security_group.cluster_nsg.id
    ]
  }
  
  # Enhanced security options
  options {
    service_lb_subnet_ids = [oci_core_subnet.svclb_Subnet.id]
    
    add_ons {
      is_kubernetes_dashboard_enabled = false
      is_tiller_enabled               = false
    }
    
    # Enable pod security policy
    admission_controller_options {
      is_pod_security_policy_enabled = true
    }
    
    kubernetes_network_config {
      pods_cidr     = "10.244.0.0/16"
      services_cidr = "10.96.0.0/16"
    }
  }
} 