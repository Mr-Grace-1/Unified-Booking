export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

export interface Translation {
  // Navigation
  'nav.dashboard': string;
  'nav.bookings': string;
  'nav.calendar': string;
  'nav.services': string;
  'nav.customers': string;
  'nav.staff': string;
  'nav.locations': string;
  'nav.integrations': string;
  'nav.analytics': string;
  
  // Common actions
  'action.create': string;
  'action.edit': string;
  'action.delete': string;
  'action.save': string;
  'action.cancel': string;
  'action.confirm': string;
  'action.search': string;
  'action.filter': string;
  'action.export': string;
  'action.import': string;
  
  // Booking status
  'status.pending': string;
  'status.confirmed': string;
  'status.in_progress': string;
  'status.completed': string;
  'status.cancelled': string;
  'status.no_show': string;
  
  // Dashboard
  'dashboard.welcome': string;
  'dashboard.todayBookings': string;
  'dashboard.totalRevenue': string;
  'dashboard.activeCustomers': string;
  'dashboard.staffMembers': string;
  'dashboard.recentActivity': string;
  'dashboard.quickActions': string;
  
  // Bookings
  'bookings.title': string;
  'bookings.newBooking': string;
  'bookings.allBookings': string;
  'bookings.searchPlaceholder': string;
  'bookings.noBookings': string;
  
  // Calendar
  'calendar.title': string;
  'calendar.day': string;
  'calendar.week': string;
  'calendar.month': string;
  'calendar.today': string;
  
  // Services
  'services.title': string;
  'services.allServices': string;
  'services.duration': string;
  'services.price': string;
  
  // Customers
  'customers.title': string;
  'customers.selectCustomer': string;
  'customers.totalBookings': string;
  'customers.totalSpent': string;
  
  // Auth
  'auth.login': string;
  'auth.signup': string;
  'auth.logout': string;
  'auth.email': string;
  'auth.password': string;
  'auth.forgotPassword': string;
  'auth.demoCredentials': string;
  
  // Common
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.noData': string;
  'common.back': string;
  'common.next': string;
  'common.previous': string;
  'common.close': string;
}

export const translations: Record<Language, Translation> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.bookings': 'All Bookings',
    'nav.calendar': 'Calendar',
    'nav.services': 'Services',
    'nav.customers': 'Customers',
    'nav.staff': 'Staff',
    'nav.locations': 'Locations',
    'nav.integrations': 'Integrations',
    'nav.analytics': 'Analytics',
    
    'action.create': 'Create',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.confirm': 'Confirm',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.export': 'Export',
    'action.import': 'Import',
    
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.no_show': 'No Show',
    
    'dashboard.welcome': 'Welcome back',
    'dashboard.todayBookings': "Today's Bookings",
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.activeCustomers': 'Active Customers',
    'dashboard.staffMembers': 'Staff Members',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    
    'bookings.title': 'Bookings',
    'bookings.newBooking': 'New Booking',
    'bookings.allBookings': 'All Bookings',
    'bookings.searchPlaceholder': 'Search by service or customer...',
    'bookings.noBookings': 'No bookings found',
    
    'calendar.title': 'Calendar',
    'calendar.day': 'Day',
    'calendar.week': 'Week',
    'calendar.month': 'Month',
    'calendar.today': 'Today',
    
    'services.title': 'Services',
    'services.allServices': 'All Services',
    'services.duration': 'Duration',
    'services.price': 'Price',
    
    'customers.title': 'Customers',
    'customers.selectCustomer': 'Select a customer to view details',
    'customers.totalBookings': 'Total Bookings',
    'customers.totalSpent': 'Total Spent',
    
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.demoCredentials': 'Demo Credentials',
    
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.noData': 'No data available',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
  },
  
  es: {
    'nav.dashboard': 'Panel',
    'nav.bookings': 'Todas las Reservas',
    'nav.calendar': 'Calendario',
    'nav.services': 'Servicios',
    'nav.customers': 'Clientes',
    'nav.staff': 'Personal',
    'nav.locations': 'Ubicaciones',
    'nav.integrations': 'Integraciones',
    'nav.analytics': 'Análisis',
    
    'action.create': 'Crear',
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.confirm': 'Confirmar',
    'action.search': 'Buscar',
    'action.filter': 'Filtrar',
    'action.export': 'Exportar',
    'action.import': 'Importar',
    
    'status.pending': 'Pendiente',
    'status.confirmed': 'Confirmado',
    'status.in_progress': 'En Progreso',
    'status.completed': 'Completado',
    'status.cancelled': 'Cancelado',
    'status.no_show': 'No Asistió',
    
    'dashboard.welcome': 'Bienvenido de nuevo',
    'dashboard.todayBookings': 'Reservas de Hoy',
    'dashboard.totalRevenue': 'Ingresos Totales',
    'dashboard.activeCustomers': 'Clientes Activos',
    'dashboard.staffMembers': 'Miembros del Personal',
    'dashboard.recentActivity': 'Actividad Reciente',
    'dashboard.quickActions': 'Acciones Rápidas',
    
    'bookings.title': 'Reservas',
    'bookings.newBooking': 'Nueva Reserva',
    'bookings.allBookings': 'Todas las Reservas',
    'bookings.searchPlaceholder': 'Buscar por servicio o cliente...',
    'bookings.noBookings': 'No se encontraron reservas',
    
    'calendar.title': 'Calendario',
    'calendar.day': 'Día',
    'calendar.week': 'Semana',
    'calendar.month': 'Mes',
    'calendar.today': 'Hoy',
    
    'services.title': 'Servicios',
    'services.allServices': 'Todos los Servicios',
    'services.duration': 'Duración',
    'services.price': 'Precio',
    
    'customers.title': 'Clientes',
    'customers.selectCustomer': 'Seleccione un cliente para ver detalles',
    'customers.totalBookings': 'Total de Reservas',
    'customers.totalSpent': 'Total Gastado',
    
    'auth.login': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.logout': 'Cerrar Sesión',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.forgotPassword': '¿Olvidó su contraseña?',
    'auth.demoCredentials': 'Credenciales de Demostración',
    
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.success': 'Éxito',
    'common.noData': 'No hay datos disponibles',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.close': 'Cerrar',
  },
  
  fr: {
    'nav.dashboard': 'Tableau de Bord',
    'nav.bookings': 'Toutes les Réservations',
    'nav.calendar': 'Calendrier',
    'nav.services': 'Services',
    'nav.customers': 'Clients',
    'nav.staff': 'Personnel',
    'nav.locations': 'Emplacements',
    'nav.integrations': 'Intégrations',
    'nav.analytics': 'Analytique',
    
    'action.create': 'Créer',
    'action.edit': 'Modifier',
    'action.delete': 'Supprimer',
    'action.save': 'Enregistrer',
    'action.cancel': 'Annuler',
    'action.confirm': 'Confirmer',
    'action.search': 'Rechercher',
    'action.filter': 'Filtrer',
    'action.export': 'Exporter',
    'action.import': 'Importer',
    
    'status.pending': 'En Attente',
    'status.confirmed': 'Confirmé',
    'status.in_progress': 'En Cours',
    'status.completed': 'Terminé',
    'status.cancelled': 'Annulé',
    'status.no_show': 'Absent',
    
    'dashboard.welcome': 'Bienvenue',
    'dashboard.todayBookings': "Réservations d'Aujourd'hui",
    'dashboard.totalRevenue': 'Revenu Total',
    'dashboard.activeCustomers': 'Clients Actifs',
    'dashboard.staffMembers': 'Membres du Personnel',
    'dashboard.recentActivity': 'Activité Récente',
    'dashboard.quickActions': 'Actions Rapides',
    
    'bookings.title': 'Réservations',
    'bookings.newBooking': 'Nouvelle Réservation',
    'bookings.allBookings': 'Toutes les Réservations',
    'bookings.searchPlaceholder': 'Rechercher par service ou client...',
    'bookings.noBookings': 'Aucune réservation trouvée',
    
    'calendar.title': 'Calendrier',
    'calendar.day': 'Jour',
    'calendar.week': 'Semaine',
    'calendar.month': 'Mois',
    'calendar.today': "Aujourd'hui",
    
    'services.title': 'Services',
    'services.allServices': 'Tous les Services',
    'services.duration': 'Durée',
    'services.price': 'Prix',
    
    'customers.title': 'Clients',
    'customers.selectCustomer': 'Sélectionnez un client pour voir les détails',
    'customers.totalBookings': 'Total des Réservations',
    'customers.totalSpent': 'Total Dépensé',
    
    'auth.login': 'Se Connecter',
    'auth.signup': "S'inscrire",
    'auth.logout': 'Se Déconnecter',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de Passe',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.demoCredentials': 'Identifiants de Démonstration',
    
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès',
    'common.noData': 'Aucune donnée disponible',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
  },
  
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.bookings': 'Alle Buchungen',
    'nav.calendar': 'Kalender',
    'nav.services': 'Dienstleistungen',
    'nav.customers': 'Kunden',
    'nav.staff': 'Personal',
    'nav.locations': 'Standorte',
    'nav.integrations': 'Integrationen',
    'nav.analytics': 'Analytik',
    
    'action.create': 'Erstellen',
    'action.edit': 'Bearbeiten',
    'action.delete': 'Löschen',
    'action.save': 'Speichern',
    'action.cancel': 'Abbrechen',
    'action.confirm': 'Bestätigen',
    'action.search': 'Suchen',
    'action.filter': 'Filtern',
    'action.export': 'Exportieren',
    'action.import': 'Importieren',
    
    'status.pending': 'Ausstehend',
    'status.confirmed': 'Bestätigt',
    'status.in_progress': 'In Bearbeitung',
    'status.completed': 'Abgeschlossen',
    'status.cancelled': 'Storniert',
    'status.no_show': 'Nicht Erschienen',
    
    'dashboard.welcome': 'Willkommen zurück',
    'dashboard.todayBookings': 'Heutige Buchungen',
    'dashboard.totalRevenue': 'Gesamtumsatz',
    'dashboard.activeCustomers': 'Aktive Kunden',
    'dashboard.staffMembers': 'Mitarbeiter',
    'dashboard.recentActivity': 'Letzte Aktivität',
    'dashboard.quickActions': 'Schnellaktionen',
    
    'bookings.title': 'Buchungen',
    'bookings.newBooking': 'Neue Buchung',
    'bookings.allBookings': 'Alle Buchungen',
    'bookings.searchPlaceholder': 'Nach Service oder Kunde suchen...',
    'bookings.noBookings': 'Keine Buchungen gefunden',
    
    'calendar.title': 'Kalender',
    'calendar.day': 'Tag',
    'calendar.week': 'Woche',
    'calendar.month': 'Monat',
    'calendar.today': 'Heute',
    
    'services.title': 'Dienstleistungen',
    'services.allServices': 'Alle Dienstleistungen',
    'services.duration': 'Dauer',
    'services.price': 'Preis',
    
    'customers.title': 'Kunden',
    'customers.selectCustomer': 'Wählen Sie einen Kunden aus, um Details anzuzeigen',
    'customers.totalBookings': 'Gesamtbuchungen',
    'customers.totalSpent': 'Gesamtausgaben',
    
    'auth.login': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.logout': 'Abmelden',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.demoCredentials': 'Demo-Anmeldedaten',
    
    'common.loading': 'Laden...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolg',
    'common.noData': 'Keine Daten verfügbar',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.close': 'Schließen',
  },
  
  zh: {
    'nav.dashboard': '仪表板',
    'nav.bookings': '所有预订',
    'nav.calendar': '日历',
    'nav.services': '服务',
    'nav.customers': '客户',
    'nav.staff': '员工',
    'nav.locations': '地点',
    'nav.integrations': '集成',
    'nav.analytics': '分析',
    
    'action.create': '创建',
    'action.edit': '编辑',
    'action.delete': '删除',
    'action.save': '保存',
    'action.cancel': '取消',
    'action.confirm': '确认',
    'action.search': '搜索',
    'action.filter': '筛选',
    'action.export': '导出',
    'action.import': '导入',
    
    'status.pending': '待处理',
    'status.confirmed': '已确认',
    'status.in_progress': '进行中',
    'status.completed': '已完成',
    'status.cancelled': '已取消',
    'status.no_show': '未出现',
    
    'dashboard.welcome': '欢迎回来',
    'dashboard.todayBookings': '今日预订',
    'dashboard.totalRevenue': '总收入',
    'dashboard.activeCustomers': '活跃客户',
    'dashboard.staffMembers': '员工',
    'dashboard.recentActivity': '最近活动',
    'dashboard.quickActions': '快速操作',
    
    'bookings.title': '预订',
    'bookings.newBooking': '新预订',
    'bookings.allBookings': '所有预订',
    'bookings.searchPlaceholder': '按服务或客户搜索...',
    'bookings.noBookings': '未找到预订',
    
    'calendar.title': '日历',
    'calendar.day': '日',
    'calendar.week': '周',
    'calendar.month': '月',
    'calendar.today': '今天',
    
    'services.title': '服务',
    'services.allServices': '所有服务',
    'services.duration': '时长',
    'services.price': '价格',
    
    'customers.title': '客户',
    'customers.selectCustomer': '选择客户以查看详情',
    'customers.totalBookings': '总预订数',
    'customers.totalSpent': '总消费',
    
    'auth.login': '登录',
    'auth.signup': '注册',
    'auth.logout': '退出',
    'auth.email': '电子邮件',
    'auth.password': '密码',
    'auth.forgotPassword': '忘记密码？',
    'auth.demoCredentials': '演示凭据',
    
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '成功',
    'common.noData': '无可用数据',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.close': '关闭',
  },
  
  ja: {
    'nav.dashboard': 'ダッシュボード',
    'nav.bookings': 'すべての予約',
    'nav.calendar': 'カレンダー',
    'nav.services': 'サービス',
    'nav.customers': '顧客',
    'nav.staff': 'スタッフ',
    'nav.locations': '場所',
    'nav.integrations': '統合',
    'nav.analytics': '分析',
    
    'action.create': '作成',
    'action.edit': '編集',
    'action.delete': '削除',
    'action.save': '保存',
    'action.cancel': 'キャンセル',
    'action.confirm': '確認',
    'action.search': '検索',
    'action.filter': 'フィルター',
    'action.export': 'エクスポート',
    'action.import': 'インポート',
    
    'status.pending': '保留中',
    'status.confirmed': '確認済み',
    'status.in_progress': '進行中',
    'status.completed': '完了',
    'status.cancelled': 'キャンセル済み',
    'status.no_show': 'ノーショー',
    
    'dashboard.welcome': 'おかえりなさい',
    'dashboard.todayBookings': '今日の予約',
    'dashboard.totalRevenue': '総収益',
    'dashboard.activeCustomers': 'アクティブ顧客',
    'dashboard.staffMembers': 'スタッフ',
    'dashboard.recentActivity': '最近のアクティビティ',
    'dashboard.quickActions': 'クイックアクション',
    
    'bookings.title': '予約',
    'bookings.newBooking': '新しい予約',
    'bookings.allBookings': 'すべての予約',
    'bookings.searchPlaceholder': 'サービスまたは顧客で検索...',
    'bookings.noBookings': '予約が見つかりません',
    
    'calendar.title': 'カレンダー',
    'calendar.day': '日',
    'calendar.week': '週',
    'calendar.month': '月',
    'calendar.today': '今日',
    
    'services.title': 'サービス',
    'services.allServices': 'すべてのサービス',
    'services.duration': '期間',
    'services.price': '価格',
    
    'customers.title': '顧客',
    'customers.selectCustomer': '詳細を表示する顧客を選択',
    'customers.totalBookings': '総予約数',
    'customers.totalSpent': '総支出',
    
    'auth.login': 'ログイン',
    'auth.signup': 'サインアップ',
    'auth.logout': 'ログアウト',
    'auth.email': 'メール',
    'auth.password': 'パスワード',
    'auth.forgotPassword': 'パスワードをお忘れですか？',
    'auth.demoCredentials': 'デモ認証情報',
    
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.success': '成功',
    'common.noData': '利用可能なデータがありません',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.previous': '前へ',
    'common.close': '閉じる',
  },
};
