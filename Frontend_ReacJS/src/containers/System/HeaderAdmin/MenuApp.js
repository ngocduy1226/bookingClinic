export const adminMenu = [
    { // quan ly data
        name: 'menu.admin.data', menus: [
            { name: 'menu.admin.data-booking', link: '/system/data-booking' },
            
        ]
    },

    { // quan ly nguoi dung
        name: 'menu.admin.manage-user', menus: [
            // { name: 'menu.admin.crud', link: '/system/manage-user' },
            { name: 'menu.admin.crud-redux', link: '/system/user-manage' },
            
        ]
    },
    { // quan ly bac si
        name: 'menu.admin.manage-doctor', menus: [
            // { name: 'menu.admin.crud', link: '/system/manage-user' },
            { name: 'menu.admin.crud-doctor', link: '/system/table-doctor' },
            {
                name: 'menu.admin.info-doctor',link: '/system/manage-doctor' 
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },

                // ]
            },
           
            // { name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule' },

            // { 
            //     name: 'menu.doctor.manage-patient', 
            //     link: '/doctor/manage-patient' 
            // },
        ]
    },
    { // quan ly kham benh
        name: 'menu.admin.medical-examination', menus: [
   
            { name: 'menu.doctor.manage-schedule', link: '/system/admin-manage-schedule' },

            { 
                name: 'menu.doctor.manage-patient', 
                link: '/system/medical-examination' 
            },
            { 
                name: 'menu.doctor.done-patient', 
                link: '/doctor/done-patient' 
            },
            { 
                name: 'menu.doctor.cancel-patient', 
                link: '/doctor/cancel-patient' 
            },
        ]
    },

    { // quan ly phong kham
        name: 'menu.admin.manage-admin', menus: [
            { name: 'menu.admin.manage-admin', link: '/system/user-admin' },
            
        ]
    },
    { // quan ly phong kham
        name: 'menu.admin.clinic', menus: [
            { name: 'menu.admin.manage-clinic', link: '/system/manage-clinic' },
            
        ]
    },
    { // quan ly chuyen khoa
        name: 'menu.admin.specialty', menus: [
            { name: 'menu.admin.manage-specialty', link: '/system/manage-specialty' },
            
        ]
    },
    // { // quan ly cam nang
    //     name: 'menu.admin.handbook', menus: [
    //         { name: 'menu.admin.manage-handbook', link: '/system/manage-handbook' },
            
    //     ]
    // },
    // { // quan ly cam bai dang
    //     name: 'menu.admin.news', menus: [
    //         { name: 'menu.admin.manage-news', link: '/system/manage-handbook' },
            
    //     ]
    // },
    { // quan ly thuoc
        name: 'menu.admin.medicine', menus: [
            { name: 'menu.admin.manage-medicine', link: '/system/manage-medicine' },
            
        ]
    },
    
    { // quan ly cam danh muc thuoc
        name: 'menu.admin.formulary', menus: [
            { name: 'menu.admin.manage-formulary', link: '/system/manage-formulary' },
            
        ]
    },
    { // quan ly binh luan
        name: 'menu.admin.comment', menus: [
            { name: 'menu.admin.manage-comment', link: '/system/manage-comment' },
            
        ]
    },
];

export const doctorMenu = [
    { // quan ly data
        name: 'menu.admin.data', menus: [
            { name: 'menu.admin.data-booking', link: '/system/data-booking' },
            
        ]
    },
    { // quan ly bac si
        name: 'menu.admin.medical-examination', 
        menus: [
            
            { 
                name: 'menu.doctor.manage-schedule', 
                link: '/doctor/manage-schedule'
            },
            { 
                name: 'menu.doctor.manage-patient', 
                link: '/doctor/manage-patient' 
            },
            { 
                name: 'menu.doctor.done-patient', 
                link: '/doctor/done-patient' 
            },
            { 
                name: 'menu.doctor.cancel-patient', 
                link: '/doctor/cancel-patient' 
            },
            
        ]
    },
    { // quan ly binh luan
        name: 'menu.admin.comment', menus: [
            { name: 'menu.admin.manage-comment', link: '/system/manage-comment' },
            
        ]
    },
    
];