import { computed } from "vue"
import {
  required,
  helpers,
  email,
  url,
  numeric,
  minLength,
  maxLength,
} from "@vuelidate/validators"

export const useRules = () =>
  computed(() => {
    return {
      username: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      password: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      geo: {
        required: helpers.withMessage(
          "Required to select",
          required
        ),
      },
      keyword: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      url: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
        url: helpers.withMessage(
          "Must be url",
          url
        ),
      },
      account_name: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      campaign_name: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },

      domain: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      site_name: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      session: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      server_password: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },

      domain_ip: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },

      server_ip: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      text: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      grid: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      color_scheme: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      img_rounded: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      card_rounded: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      buttons_rounded: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      header: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      main: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      footer: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
      font: {
        required: helpers.withMessage(
          "Required to fill",
          required
        ),
      },
    }
  })
