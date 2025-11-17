package com.fsa.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {
    private final Long id;
    private final boolean admin;
    private final List<String> roles;

    public UserPrincipal(Long id, boolean admin, List<String> roles) {
        this.id = id;
        this.admin = admin;
        this.roles = roles;
    }

    public Long getId() { return id; }
    public boolean isAdminFlag() { return admin; }
    public List<String> getRolesRaw() { return roles; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> list = roles.stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
                .collect(Collectors.toList());
        if (admin) list.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return list;
    }

    @Override public String getPassword() { return ""; }
    @Override public String getUsername() { return String.valueOf(id); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}

