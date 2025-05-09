import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      email
      phoneNo
      accountType
      dob
      gender
      country
      state
      city
      address
      paymentCurrency
      isApproved
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      email
      phoneNo
      accountType
      dob
      gender
      country
      state
      city
      address
      paymentCurrency
      isApproved
    }
  }
`;

export const GET_FAMILIES = gql`
  query GetFamilies {
    getFamilies {
      id
      user {
        id
        firstName
        lastName
        email
        phoneNo
        dob
        gender
        country
        state
        city
        address
        latitude
        longitude
        paymentCurrency
        isApproved
      }
    }
  }
`;

export const GET_FAMILY = gql`
  query GetFamily($id: ID!) {
    getFamily(id: $id) {
      id
      user {
        id
        firstName
        lastName
        email
        phoneNo
        dob
        gender
        country
        state
        city
        address
        latitude
        longitude
        paymentCurrency
        isApproved
      }
    }
  }
`;

export const GET_CAREBUSINESSES = gql`
  query GetCareBusinesses {
    getCareBusinesses {
      id
      user {
        id
        firstName
        lastName
        email
        phoneNo
        dob
        gender
        country
        state
        city
        address
        latitude
        longitude
        paymentCurrency
        isApproved
      }
      homes {
        id
        name
      }
      cacRegDocument
      memorandumOfAssociation
      boardOfDirectors
      businessEmail
      otherCertificates
      isApproved
    }
  }
`;

export const GET_CAREBUSINESS = gql`
  query GetCareBusiness($id: ID!) {
    getCareBusiness(id: $id) {
      id
      user {
        id
        firstName
        lastName
        email
        phoneNo
        dob
        gender
        country
        state
        city
        address
        latitude
        longitude
        paymentCurrency
        isApproved
      }
      homes {
        id
        name
        hourlyPrice
        dailyPrice
        weeklyPrice
        monthlyPrice
        yearlyPrice
        description
        yearEstablished
        phoneNo
        capacity
        availableSlots
        amenities
        imagesVideos
        location
        latitude
        longitude
        isApproved
      }
      cacRegDocument
      memorandumOfAssociation
      boardOfDirectors
      businessEmail
      otherCertificates
      isApproved
    }
  }
`;

export const GET_STUDENTS = gql`
  query GetStudents {
    getStudents {
      id
      user {
        id
        firstName
        lastName
        email
        phoneNo
        dob
        gender
        country
        state
        city
        address
        latitude
        longitude
        paymentCurrency
        isApproved
      }
      availability {
        id
        day
        startTime
        endTime
        applyToAllDays
        applyToAllWeeks
      }
      incomingRequests {
        id
        status

        careHome {
          id
          careBusiness {
            id
            user {
              firstName
              lastName
              phoneNo
            }
            cacRegDocument
            memorandumOfAssociation
            boardOfDirectors
            businessEmail
            otherCertificates
            isApproved
          }
          name
          description
          yearEstablished
          phoneNo
          location
          latitude
          longitude
        }
        serviceType
        duration
      }
      level
      idCard
      certificate
      careExperienceLength
      accessToTransport
      isApproved
      clients {
        firstName
        lastName
        phoneNo
      }
      activeCareHomes {
        name
        yearEstablished
        location
      }
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      user {
        id
        firstName
        lastName
        email
        phoneNo
        dob
        gender
        country
        state
        city
        address
        latitude
        longitude
        paymentCurrency
        isApproved
      }
      availability {
        id
        day
        startTime
        endTime
        applyToAllDays
        applyToAllWeeks
      }
      incomingRequests {
        id
        status

        careHome {
          id
          careBusiness {
            id
            user {
              firstName
              lastName
              phoneNo
            }
            cacRegDocument
            memorandumOfAssociation
            boardOfDirectors
            businessEmail
            otherCertificates
            isApproved
          }
          name
          description
          yearEstablished
          phoneNo
          location
          latitude
          longitude
        }
        serviceType
        duration
      }
      level
      idCard
      certificate
      careExperienceLength
      accessToTransport
      isApproved
      careServiceTypes {
        id
        name
      }
      guarantorEmails
      guarantors {
        id
        student {
          id
          user {
            firstName
            lastName
            email
          }
        }
        firstName
        lastName
        email
        phoneNo
        bvn
        passport
        occupation
        address
        verified
        createdAt
      }
      clients {
        firstName
        lastName
        phoneNo
      }
      activeCareHomes {
        name
        yearEstablished
        location
      }
    }
  }
`;

// Get all dependents
export const GET_DEPENDENTS = gql`
  query GetDependents {
    adminGetDependents {
      id
      family {
        id
        user {
          id
          accountType
          address
          firstName
          city
          country
          dob
          profilePics
          email
          gender
          lastName
          latitude
          longitude
          paymentCurrency
          phoneNo
          state
          isApproved
        }
      }

      firstName
      lastName
      phoneNo
      country
      state
      city
      address
      latitude
      longitude
      profilePics
      relationship
      dateOfBirth
      medicalConcerns
      appointments {
        id
        dependent {
          firstName
          lastName
          phoneNo
          address
        }
        careHome {
          id
          careBusiness {
            id
            cacRegDocument
            memorandumOfAssociation
            businessEmail
            isApproved
            homes {
              id
              name
              phoneNo
              location
            }
          }
          availability {
            id
            day
            startTime
            endTime
            applyToAllWeeks
          }
          reviews {
            id
            date
            rating
            review
          }
          isApproved
        }
        scheduledDate
        scheduledStartTime
        scheduledEndTime
        description
      }
      careLogs {
        id
        carehome {
          id
          name
        }
        notes
        createdAt
      }

      student {
        id
        user {
          id
          address
          firstName
          city
          country
          dob
          profilePics
          email
          gender
          lastName
          phoneNo
          state
        }
        availability {
          id
          day
          startTime
          endTime
          applyToAllDays
          applyToAllWeeks
        }
        idCard
        certificate
        careExperienceLength
      }

      outgoingRequests {
        id
        status
        serviceType
        duration
        price
      }
    }
  }
`;

// Get single dependent
export const GET_DEPENDENT = gql`
  query GetDependent($id: ID!) {
    adminGetDependent(id: $id) {
      id
      family {
        id
        user {
          id
          accountType
          address
          firstName
          city
          country
          dob
          profilePics
          email
          gender
          lastName
          latitude
          longitude
          paymentCurrency
          phoneNo
          state
          isApproved
        }
      }

      firstName
      lastName
      phoneNo
      country
      state
      city
      address
      latitude
      longitude
      profilePics
      relationship
      dateOfBirth
      medicalConcerns
      appointments {
        id
        dependent {
          firstName
          lastName
          phoneNo
          address
        }
        careHome {
          id
          careBusiness {
            id
            cacRegDocument
            memorandumOfAssociation
            businessEmail
            isApproved
            homes {
              id
              name
              phoneNo
              location
            }
          }
          availability {
            id
            day
            startTime
            endTime
            applyToAllWeeks
          }
          reviews {
            id
            date
            rating
            review
          }
          isApproved
        }
        scheduledDate
        scheduledStartTime
        scheduledEndTime
        description
      }
      careLogs {
        id
        carehome {
          id
          name
        }
        notes
        createdAt
      }

      student {
        id
        user {
          id
          address
          firstName
          city
          country
          dob
          profilePics
          email
          gender
          lastName
          phoneNo
          state
        }
        availability {
          id
          day
          startTime
          endTime
          applyToAllDays
          applyToAllWeeks
        }
        idCard
        certificate
        careExperienceLength
      }

      outgoingRequests {
        id
        status
        serviceType
        duration
        price
      }
    }
  }
`;

export const GET_ALL_CAREHOMES = gql`
  query GetAllCarehomes {
    getAllCareHomes {
      id
      careBusiness {
        id
        user {
          id
          firstName
          lastName
          email
          phoneNo
        }
        cacRegDocument
        memorandumOfAssociation
        boardOfDirectors
        businessEmail
        otherCertificates
        isApproved
      }
      clients {
        id
        firstName
        lastName
        phoneNo
        country
        state
        city
        address
        latitude
        longitude
        profilePics
        relationship
        dateOfBirth
        medicalConcerns
      }
      students {
        id
      }
      availability {
        id
        day
        startTime
        endTime
        applyToAllDays
        applyToAllWeeks
      }

      incomingRequests {
        id
        status
        serviceType
        duration
        price
      }
      outgoingRequests {
        id
        status
        serviceType
        duration
        price
      }
      name
      hourlyPrice
      dailyPrice
      weeklyPrice
      monthlyPrice
      yearlyPrice
      description
      yearEstablished
      phoneNo
      capacity
      availableSlots
      amenities
      imagesVideos
      location
      latitude
      longitude
      isApproved
    }
  }
`;

export const GET_CAREHOME = gql`
  query GetAllCarehomes($id: ID!) {
    adminGetCarehomeById(id: $id) {
      id
      careBusiness {
        id
        user {
          id
          firstName
          lastName
          email
          phoneNo
        }
        cacRegDocument
        memorandumOfAssociation
        boardOfDirectors
        businessEmail
        otherCertificates
        isApproved
      }
      clients {
        id
        firstName
        lastName
        phoneNo
        country
        state
        city
        address
        latitude
        longitude
        profilePics
        relationship
        dateOfBirth
        medicalConcerns
      }
      students {
        id
      }
      availability {
        id
        day
        startTime
        endTime
        applyToAllDays
        applyToAllWeeks
      }

      incomingRequests {
        id
        status
        serviceType
        duration
        price
      }
      outgoingRequests {
        id
        status
        serviceType
        duration
        price
      }
      name
      hourlyPrice
      dailyPrice
      weeklyPrice
      monthlyPrice
      yearlyPrice
      description
      yearEstablished
      phoneNo
      capacity
      availableSlots
      amenities
      imagesVideos
      location
      latitude
      longitude
      isApproved
    }
  }
`;

export const GET_FAMILY_PROFILE = gql`
  query GetFamilyProfile {
    getFamilyProfile {
      id
      user {
        id
        accountType

        address
        firstName
        city
        country
        dob
        email
        gender
        lastName
        latitude
        longitude
        paymentCurrency
        phoneNo
        state
        isApproved
      }
      dependent {
        id
        family {
          id
          user {
            id
            accountType
            address
            firstName
            city
            country
            dob
            email
            gender
            lastName
            latitude
            longitude
            paymentCurrency
            phoneNo
            state
            isApproved
          }
        }

        firstName
        lastName
        phoneNo
        country
        state
        city
        address
        latitude
        longitude
        profilePics
        relationship
        dateOfBirth
        medicalConcerns
        appointments {
          id
          dependent {
            firstName
            lastName
            phoneNo
            address
          }
          student {
            id
            user {
              id
              accountType
              address
              firstName
              city
              country
              dob
              email
              gender
              lastName
              latitude
              longitude
              paymentCurrency
              phoneNo
              state
              isApproved
            }
            availability {
              id
              day
              startTime
              endTime
              applyToAllDays
              applyToAllWeeks
            }
            incomingRequests {
              id
              status
              serviceType
              duration
              price
            }
            idCard
            certificate
            careExperienceLength
            accessToTransport
            isApproved
          }
          careBusiness {
            id
            businessEmail
            cacRegDocument
            user {
              firstName
              lastName
              phoneNo
            }
            homes {
              id
              name
              phoneNo
            }
            isApproved
          }
          scheduledDate
          scheduledTime
          status
        }
        careLogs {
          id
          student {
            user {
              firstName
              lastName
              gender
              phoneNo
              email
            }
          }
          notes
          createdAt
        }

        outgoingRequests {
          id
          status
          serviceType
          duration
          price
        }
      }
    }
  }
`;

export const GET_CAREBUSINESS_PROFILE = gql`
  query GetCareBusinessProfile {
    getCareBusinessProfile {
      id
      user {
        id
        accountType
        address
        firstName
        city
        country
        dob
        email
        gender
        lastName
        latitude
        longitude
        paymentCurrency
        phoneNo
        state
        isApproved
      }
      cacRegDocument
      memorandumOfAssociation
      boardOfDirectors
      businessEmail
      otherCertificates
      homes {
        id
        name
        hourlyPrice
        dailyPrice
        weeklyPrice
        monthlyPrice
        yearlyPrice
        description
        yearlyPrice
        phoneNo
        capacity
        amenities
        imagesVideos
        location
        latitude
        longitude
      }
      isApproved
    }
  }
`;

export const GET_STUDENT_PROFILE = gql`
  query GetStudentProfile {
    getStudentProfile {
      id
      user {
        id
        accountType
        address
        firstName
        city
        country
        dob
        email
        gender
        lastName
        latitude
        longitude
        paymentCurrency
        phoneNo
        state
        isApproved
      }
      idCard
      certificate
      careExperienceLength
      accessToTransport
      isApproved
    }
  }
`;

export const GET_GUARANTORS = gql`
  query GetGuarantors {
    getGuarantors {
      id
      student {
        id
        user {
          id
          firstName
          lastName
          email
          phoneNo
        }
      }
      firstName
      lastName
      email
      phoneNo
      bvn
      passport
      occupation
      address
      verified
      createdAt
    }
  }
`;
export const GET_GUARANTOR = gql`
  query GetGuarantors($id: ID!) {
    getGuarantor(id: $id) {
      id
      student {
        id
        user {
          id
          firstName
          lastName
          email
          phoneNo
        }
      }
      firstName
      lastName
      email
      phoneNo
      bvn
      passport
      occupation
      address
      verified
      createdAt
    }
  }
`;

export const GET_GUARANTORS_BY_ID = gql`
  query GetGuarantorsByStudentId($studentId: ID!) {
    getGuarantorsByStudentId(studentId: $studentId) {
      id
      firstName
      lastName
      email
      phoneNo
    }
  }
`;

export const GET_GUARANTOR_BY_STUDENT_ID = gql`
  query GetGuarantorsByStudentId($studentId: ID!) {
    getGuarantorsByStudentId(studentId: $studentId) {
      id
      student {
        id
        user {
          id
          firstName
          lastName
          email
          phoneNo
        }
      }
      firstName
      lastName
      email
      phoneNo
      bvn
      passport
      occupation
      address
      verified
      createdAt
    }
  }
`;

export const GET_ALL_CARESERVICETYPES = gql`
  query GetAllCareServiceTypes {
    getAllCareServiceTypes {
      id
      name
    }
  }
`;

export const DASHBOARD_OVERVIEW = gql`
  query DataBaseOverview {
    databaseOverview {
      totalUsers
      totalFamilies
      totalDependents
      totalProviders
      totalCareHomes
      totalStudents
      totalGuarantors
      totalRevenue
      allContracts
      activeContracts
      pendingContracts
      cancelledContracts
      expiredContracts
    }
  }
`;
