package com.example.application;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.server.PWA;
import com.vaadin.flow.theme.Theme;

@Theme(value = "hilla-todo")
@PWA(name = "Hilla Todo Demo", shortName = "Todo", offlineResources = { "images/logo.png" })
public class VaadinConfiguration implements AppShellConfigurator {

}
