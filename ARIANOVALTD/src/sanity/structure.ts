import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Arianova Estate')
    .items([
      // 1. Inventory Monitor (Custom Filters)
      S.listItem()
        .title('Inventory Monitor')
        .id('inventory-monitor')
        .child(
          S.list()
            .title('Inventory Diagnostics')
            .items([
              S.listItem()
                .title('🚨 Out of Stock')
                .id('out-of-stock')
                .child(
                  S.documentList()
                    .title('Out of Stock')
                    .filter('_type == "wine" && physical_stock <= 0')
                ),
              S.listItem()
                .title('⚠️ Low Stock')
                .id('low-stock')
                .child(
                  S.documentList()
                    .title('Low Stock Alerts')
                    // physical_stock - committed_stock < low_stock_alert
                    .filter('_type == "wine" && (physical_stock - committed_stock) < low_stock_alert && physical_stock > 0')
                ),
              S.listItem()
                .title('💎 High Value Vintages')
                .id('high-value')
                .child(
                  S.documentList()
                    .title('High Value Vintages')
                    .filter('_type == "wine"')
                    .defaultOrdering([{ field: 'price', direction: 'desc' }])
                ),
            ])
        ),
      
      // Divider for cleaner UI aesthetics
      S.divider(),

      // 2. Order Feed (Recent Sales)
      S.listItem()
        .title('Recent Sales')
        .id('recent-sales')
        .child(
          S.documentList()
            .title('Recent Orders')
            .filter('_type == "order"')
            // Sort by creation date so the newest orders pop to the top natively
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      S.divider(),

      // 3. Automatically map the rest of the generic documents (Customer, exact Wine creation, etc)
      // But hide the generic 'order' list since we just built a better one uniquely for 'Recent Sales'
      ...S.documentTypeListItems().filter(
        (item) => !['order'].includes(item.getId() as string)
      ),
    ])
