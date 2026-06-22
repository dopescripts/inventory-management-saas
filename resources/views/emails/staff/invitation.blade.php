<x-mail::message>
# You've been invited!

You have been invited to join the team. You can log in using the following credentials:

**Password:** {{ $password }}

<x-mail::button :url="$loginUrl">
Log In
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
